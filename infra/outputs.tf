output "vpc_id" {
  description = "ID of the vidamobile VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = aws_subnet.public[*].id
}

output "app_subnet_ids" {
  description = "Private application subnet IDs."
  value       = aws_subnet.app[*].id
}

output "database_subnet_ids" {
  description = "Private database subnet IDs."
  value       = aws_subnet.database[*].id
}
output "alb_security_group_id" {
  description = "Security group used by the Application Load Balancer."
  value       = aws_security_group.alb.id
}

output "frontend_security_group_id" {
  description = "Security group used by the frontend ECS service."
  value       = aws_security_group.frontend.id
}

output "api_security_group_id" {
  description = "Security group used by the FastAPI ECS service."
  value       = aws_security_group.api.id
}

output "database_security_group_id" {
  description = "Security group used by RDS PostgreSQL."
  value       = aws_security_group.database.id
}
output "api_ecr_repository_url" {
  description = "ECR repository URL for the FastAPI container."
  value       = aws_ecr_repository.api.repository_url
}


output "frontend_ecr_repository_url" {
  description = "ECR repository URL for the Next.js container."
  value       = aws_ecr_repository.frontend.repository_url
}


output "ecs_execution_role_arn" {
  description = "IAM role used by ECS to pull images and publish logs."
  value       = aws_iam_role.ecs_execution.arn
}


output "ecs_task_role_arn" {
  description = "IAM role available to the application containers."
  value       = aws_iam_role.ecs_task.arn
}


output "api_log_group_name" {
  description = "CloudWatch log group for FastAPI."
  value       = aws_cloudwatch_log_group.api.name
}


output "frontend_log_group_name" {
  description = "CloudWatch log group for Next.js."
  value       = aws_cloudwatch_log_group.frontend.name
}
output "database_endpoint" {
  description = "RDS PostgreSQL endpoint."
  value       = aws_db_instance.postgres.address
}

output "database_port" {
  description = "RDS PostgreSQL port."
  value       = aws_db_instance.postgres.port
}

output "database_secret_arn" {
  description = "Secrets Manager ARN containing the RDS master credentials."
  value       = aws_db_instance.postgres.master_user_secret[0].secret_arn
}
output "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}


output "frontend_task_definition_arn" {
  description = "Frontend ECS task definition ARN."
  value       = aws_ecs_task_definition.frontend.arn
}


output "api_task_definition_arn" {
  description = "FastAPI ECS task definition ARN."
  value       = aws_ecs_task_definition.api.arn
}
output "load_balancer_dns_name" {
  description = "Public DNS name of the Application Load Balancer."
  value       = aws_lb.main.dns_name
}


output "load_balancer_arn" {
  description = "ARN of the Application Load Balancer."
  value       = aws_lb.main.arn
}


output "frontend_service_name" {
  description = "Name of the frontend ECS service."
  value       = aws_ecs_service.frontend.name
}


output "api_service_name" {
  description = "Name of the API ECS service."
  value       = aws_ecs_service.api.name
}
output "frontend_autoscaling_min_capacity" {
  description = "Minimum frontend ECS task count."
  value       = aws_appautoscaling_target.frontend.min_capacity
}


output "frontend_autoscaling_max_capacity" {
  description = "Maximum frontend ECS task count."
  value       = aws_appautoscaling_target.frontend.max_capacity
}


output "api_autoscaling_min_capacity" {
  description = "Minimum API ECS task count."
  value       = aws_appautoscaling_target.api.min_capacity
}


output "api_autoscaling_max_capacity" {
  description = "Maximum API ECS task count."
  value       = aws_appautoscaling_target.api.max_capacity
}
output "application_url" {
  description = "Public HTTPS URL for vidamobile."
  value       = "https://${var.domain_name}"
}


output "acm_certificate_arn" {
  description = "ARN of the ACM TLS certificate."
  value       = aws_acm_certificate.main.arn
}