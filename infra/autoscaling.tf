resource "aws_appautoscaling_target" "frontend" {
  min_capacity = 2
  max_capacity = 4

  resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.frontend.name}"

  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}


resource "aws_appautoscaling_policy" "frontend_cpu" {
  name = "${var.project_name}-${var.environment}-frontend-cpu"

  policy_type = "TargetTrackingScaling"

  resource_id        = aws_appautoscaling_target.frontend.resource_id
  scalable_dimension = aws_appautoscaling_target.frontend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 60

    scale_out_cooldown = 60
    scale_in_cooldown  = 180
  }
}


resource "aws_appautoscaling_target" "api" {
  min_capacity = 3
  max_capacity = 8

  resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"

  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}


resource "aws_appautoscaling_policy" "api_cpu" {
  name = "${var.project_name}-${var.environment}-api-cpu"

  policy_type = "TargetTrackingScaling"

  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 60

    scale_out_cooldown = 60
    scale_in_cooldown  = 180
  }
}