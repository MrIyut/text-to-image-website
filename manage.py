#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import shutil
import atexit

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'image_illuminate.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

directory_path = os.path.abspath('./app/static/app/images/')
def cleanup_function():
	shutil.rmtree(directory_path, ignore_errors=True)
	os.makedirs(directory_path, exist_ok=True)

atexit.register(cleanup_function)

if __name__ == '__main__':
    main()
