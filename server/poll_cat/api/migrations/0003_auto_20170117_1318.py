# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-01-17 13:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20170117_1029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]