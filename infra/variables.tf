variable "project_name" {
  description = "Name used to identify vidamobile infrastructure."
  type        = string
  default     = "vidamobile"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region where vidamobile would be deployed."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR range for the vidamobile VPC."
  type        = string
  default     = "10.0.0.0/16"
}
variable "database_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "event_map"
}

variable "database_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "vidamobile_admin"
}

variable "database_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "database_multi_az" {
  description = "Enable a Multi-AZ RDS deployment for high availability."
  type        = bool
  default     = false
}
variable "image_tag" {
  description = "Docker image tag ECS should deploy. CI should normally set this to a Git commit SHA."
  type        = string
}

variable "jwt_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the application's JWT signing key."
  type        = string
  sensitive   = true
}
variable "domain_name" {
  description = "Public domain name for vidamobile, such as vidamobile.com."
  type        = string
}

variable "route53_zone_id" {
  description = "Route 53 public hosted zone ID containing the vidamobile domain."
  type        = string
}