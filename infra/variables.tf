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