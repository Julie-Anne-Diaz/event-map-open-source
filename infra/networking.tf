data "aws_availability_zones" "available" {
  state = "available"
}


locals {
  availability_zones = slice(
    data.aws_availability_zones.available.names,
    0,
    2
  )

  public_subnet_cidrs = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  app_subnet_cidrs = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]

  database_subnet_cidrs = [
    "10.0.21.0/24",
    "10.0.22.0/24"
  ]
}


resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}


resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  }
}


resource "aws_subnet" "public" {
  count = 2

  vpc_id = aws_vpc.main.id

  cidr_block = local.public_subnet_cidrs[count.index]

  availability_zone = local.availability_zones[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-${count.index + 1}"
    Tier = "public"
  }
}


resource "aws_subnet" "app" {
  count = 2

  vpc_id = aws_vpc.main.id

  cidr_block = local.app_subnet_cidrs[count.index]

  availability_zone = local.availability_zones[count.index]

  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-${var.environment}-app-${count.index + 1}"
    Tier = "application"
  }
}


resource "aws_subnet" "database" {
  count = 2

  vpc_id = aws_vpc.main.id

  cidr_block = local.database_subnet_cidrs[count.index]

  availability_zone = local.availability_zones[count.index]

  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-${var.environment}-database-${count.index + 1}"
    Tier = "database"
  }
}


resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-public-rt"
  }
}


resource "aws_route_table_association" "public" {
  count = 2

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}