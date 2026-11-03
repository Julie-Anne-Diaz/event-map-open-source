resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}"
  }
}
resource "aws_ecs_task_definition" "frontend" {
  family = "${var.project_name}-${var.environment}-frontend"

  requires_compatibilities = [
    "FARGATE"
  ]

  network_mode = "awsvpc"

  cpu    = "256"
  memory = "512"

  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn


  container_definitions = jsonencode([
    {
      name = "frontend"

      image = "${aws_ecr_repository.frontend.repository_url}:${var.image_tag}"

      essential = true

      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.frontend.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])


  tags = {
    Name = "${var.project_name}-${var.environment}-frontend"
  }
}
resource "aws_ecs_task_definition" "api" {
  family = "${var.project_name}-${var.environment}-api"

  requires_compatibilities = [
    "FARGATE"
  ]

  network_mode = "awsvpc"

  cpu    = "256"
  memory = "512"

  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn


  container_definitions = jsonencode([
    {
      name = "api"

      image = "${aws_ecr_repository.api.repository_url}:${var.image_tag}"

      essential = true

      portMappings = [
        {
          containerPort = 8010
          protocol      = "tcp"
        }
      ]


      environment = [
        {
          name  = "DB_HOST"
          value = aws_db_instance.postgres.address
        },
        {
          name  = "DB_PORT"
          value = tostring(aws_db_instance.postgres.port)
        },
        {
          name  = "DB_NAME"
          value = var.database_name
        }
      ]


      secrets = [
        {
          name = "DB_USER"

          valueFrom = "${aws_db_instance.postgres.master_user_secret[0].secret_arn}:username::"
        },
        {
          name = "DB_PASSWORD"

          valueFrom = "${aws_db_instance.postgres.master_user_secret[0].secret_arn}:password::"
        },
        {
          name      = "SECRET_KEY"
          valueFrom = var.jwt_secret_arn
        }
      ]


      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.api.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "api"
        }
      }
    }
  ])


  tags = {
    Name = "${var.project_name}-${var.environment}-api"
  }
}
resource "aws_ecs_service" "frontend" {
  name = "${var.project_name}-${var.environment}-frontend"

  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn

  launch_type = "FARGATE"

  desired_count = 2

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  health_check_grace_period_seconds = 30

  network_configuration {
    subnets = aws_subnet.app[*].id

    security_groups = [
      aws_security_group.frontend.id
    ]

    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn

    container_name = "frontend"
    container_port = 3000
  }

  depends_on = [
    aws_lb_listener.https
  ]
  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-frontend-service"
  }
}
resource "aws_ecs_service" "api" {
  name = "${var.project_name}-${var.environment}-api"

  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn

  launch_type = "FARGATE"

  desired_count = 3

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  health_check_grace_period_seconds = 30

  network_configuration {
    subnets = aws_subnet.app[*].id

    security_groups = [
      aws_security_group.api.id
    ]

    assign_public_ip = false
  }
  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn

    container_name = "api"
    container_port = 8010
  }

  depends_on = [
    aws_lb_listener_rule.api
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-api-service"
  }
}