mock_provider "aws" {
  override_during = plan
  override_data {
    target = data.aws_iam_policy_document.ecs_task_assume_role

    values = {
      json = <<-JSON
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      }
      JSON
    }
  }


  override_data {
    target = data.aws_iam_policy_document.ecs_execution_secrets

    values = {
      json = <<-JSON
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "secretsmanager:GetSecretValue"
            ],
            "Resource": "*"
          }
        ]
      }
      JSON
    }
  }
  mock_data "aws_availability_zones" {
    defaults = {
      names = [
        "us-east-1a",
        "us-east-1b",
        "us-east-1c"
      ]
    }
  }

  mock_resource "aws_db_instance" {
    defaults = {
      address = "vidamobile-db.mock.internal"
      port    = 5432

      master_user_secret = [
        {
          kms_key_id    = "mock-kms-key"
          secret_arn    = "arn:aws:secretsmanager:us-east-1:123456789012:secret:vidamobile-rds"
          secret_status = "active"
        }
      ]
    }
  }

  mock_resource "aws_ecr_repository" {
    defaults = {
      repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/vidamobile"
    }
  }

  mock_resource "aws_iam_role" {
    defaults = {
      arn = "arn:aws:iam::123456789012:role/vidamobile-mock-role"
    }
  }

  mock_resource "aws_ecs_task_definition" {
    defaults = {
      arn = "arn:aws:ecs:us-east-1:123456789012:task-definition/vidamobile:1"
    }
  }

  mock_resource "aws_lb" {
    defaults = {
      arn      = "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/vidamobile/mock"
      dns_name = "vidamobile-mock.us-east-1.elb.amazonaws.com"
      zone_id  = "Z35SXDOTRQ7X7K"
    }
  }

  mock_resource "aws_lb_target_group" {
    defaults = {
      arn = "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/vidamobile/mock"
    }
  }

  mock_resource "aws_lb_listener" {
    defaults = {
      arn = "arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/vidamobile/mock/listener"
    }
  }

  mock_resource "aws_acm_certificate" {
    defaults = {
      arn = "arn:aws:acm:us-east-1:123456789012:certificate/00000000-0000-0000-0000-000000000000"

      domain_validation_options = [
        {
          domain_name           = "vidamobile.example.com"
          resource_record_name  = "_mock.vidamobile.example.com"
          resource_record_type  = "CNAME"
          resource_record_value = "_mock.acm-validations.aws"
        }
      ]
    }
  }
}


run "vidamobile_architecture" {
  command = plan

  variables {
    image_tag = "test-commit-sha"

    jwt_secret_arn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:vidamobile-jwt"

    domain_name = "vidamobile.example.com"

    route53_zone_id = "Z0000000000000000000"
  }


  assert {
    condition     = aws_vpc.main.cidr_block == "10.0.0.0/16"
    error_message = "The VPC must use the expected private CIDR range."
  }


  assert {
    condition = (
      length(aws_subnet.public) == 2 &&
      length(aws_subnet.app) == 2 &&
      length(aws_subnet.database) == 2
    )

    error_message = "Vidamobile must span two public, two application, and two database subnets."
  }


  assert {
    condition = alltrue([
      for subnet in aws_subnet.app :
      subnet.map_public_ip_on_launch == false
    ])

    error_message = "Application subnets must not assign public IP addresses."
  }


  assert {
    condition = alltrue([
      for subnet in aws_subnet.database :
      subnet.map_public_ip_on_launch == false
    ])

    error_message = "Database subnets must remain private."
  }


  assert {
    condition = (
      aws_db_instance.postgres.publicly_accessible == false &&
      aws_db_instance.postgres.storage_encrypted == true
    )

    error_message = "RDS must be private and encrypted."
  }


  assert {
    condition = (
      aws_lb.main.internal == false &&
      aws_lb.main.load_balancer_type == "application"
    )

    error_message = "The public entry point must be an internet-facing Application Load Balancer."
  }


  assert {
    condition = (
      aws_lb_listener.https.port == 443 &&
      aws_lb_listener.https.protocol == "HTTPS"
    )

    error_message = "The public listener must use HTTPS on port 443."
  }


  assert {
    condition = (
      contains(
        aws_ecs_task_definition.frontend.requires_compatibilities,
        "FARGATE"
      ) &&
      aws_ecs_task_definition.frontend.network_mode == "awsvpc"
    )

    error_message = "Frontend tasks must use Fargate with awsvpc networking."
  }


  assert {
    condition = (
      contains(
        aws_ecs_task_definition.api.requires_compatibilities,
        "FARGATE"
      ) &&
      aws_ecs_task_definition.api.network_mode == "awsvpc"
    )

    error_message = "API tasks must use Fargate with awsvpc networking."
  }


  assert {
    condition = (
      aws_ecs_service.frontend.desired_count == 2 &&
      aws_ecs_service.api.desired_count == 3
    )

    error_message = "Initial ECS capacity must be two frontend tasks and three API tasks."
  }


  assert {
    condition = (
      aws_appautoscaling_target.frontend.min_capacity == 2 &&
      aws_appautoscaling_target.frontend.max_capacity == 4
    )

    error_message = "Frontend autoscaling must remain between two and four tasks."
  }


  assert {
    condition = (
      aws_appautoscaling_target.api.min_capacity == 3 &&
      aws_appautoscaling_target.api.max_capacity == 8
    )

    error_message = "API autoscaling must remain between three and eight tasks."
  }


  assert {
    condition = (
      aws_ecr_repository.api.image_tag_mutability == "IMMUTABLE" &&
      aws_ecr_repository.frontend.image_tag_mutability == "IMMUTABLE"
    )

    error_message = "ECR images must use immutable version tags."
  }
}