from django.db import models


class QuerySet(models.QuerySet):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None


class MyModel(models.Model):
    objects = QuerySet.as_manager()
