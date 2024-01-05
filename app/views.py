from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .image_generator import generate_image
import os

# Create your views here.
options = [
        {'label': 'Gandalf', 'value': 'Gandalf', 'image_url': 'Gandalf.jpg'},
        {'label': 'Barbie', 'value': 'Barbie', 'image_url': 'Barbie.jpeg'},
        {'label': 'Dracula', 'value': 'Dracula', 'image_url': 'Dracula.webp'},
        {'label': 'Sauron', 'value': 'Sauron', 'image_url': 'Sauron.jpg'},
        {'label': 'Scooby Doo', 'value': 'Scooby Doo', 'image_url': 'ScoobyDoo.jpeg'},
        {'label': 'Harry Potter', 'value': 'Harry Potter', 'image_url': 'harrypotter.0.jpg'},
        {'label': 'Mickey Mouse', 'value': 'Mickey Mouse', 'image_url': 'Mickey.jpg'},
]

def cleanupImages(response):
    if 'image_paths' in response.session:
        image_paths = response.session['image_paths']
        print("cleanup", image_paths)
        for image_path in image_paths:
            path = f'./app/static/app/images/{image_path}'
            print(path, os.path.exists(path))
            if os.path.exists(path):
                os.remove(path)
        del response.session['image_paths']

def index(response):
    if response.method == "POST":
        print(response.POST.get('Prompt', ''))
        params = {}
        params['prompt'] = response.POST.get('Prompt', '')
        params['samples'] = 2
        params['width'] = 832
        params['height'] = 1216

        cleanupImages(response)
        image_paths = generate_image(**params)
        print(image_paths)

        response.session['image_paths'] = image_paths
        return render(response, "app/index.html", {
            'image_paths': image_paths,
            'options': options,
        })

    
    cleanupImages(response)
    return render(response, "app/index.html", {
        'options': options,
        'image_paths': [],
    })