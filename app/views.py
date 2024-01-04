from django.shortcuts import render
from django.http import HttpResponse
from .image_generator import generate_image

# Create your views here.

def index(response):
    if response.method == "POST":
        print(response.POST.get('Prompt', ''))
        params = {}
        params['prompt'] = response.POST.get('Prompt', '')
        params['samples'] = 4
        params['width'] = 832
        params['height'] = 1216

        image_paths = generate_image(**params)
        print(image_paths)

        return render(response, "app/index.html", {
            'image_paths': image_paths,
        })

    return render(response, "app/index.html", {})
