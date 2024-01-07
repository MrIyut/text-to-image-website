from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .image_generator import generate_image
import os, json

# Create your views here.
options = [
        {'label': 'Gandalf','image_url': 'Gandalf.jpg'},
        {'label': 'Barbie', 'image_url': 'Barbie.jpeg'},
        {'label': 'Dracula', 'image_url': 'Dracula.png'},
        {'label': 'Sauron', 'image_url': 'Sauron.jpg'},
        {'label': 'Scooby Doo', 'image_url': 'ScoobyDoo.jpeg'},
        {'label': 'Harry Potter', 'image_url': 'harrypotter.0.jpg'},
        {'label': 'Mickey Mouse', 'image_url': 'Mickey.jpg'},
]

def cleanupImages(response):
    if 'image_paths' in response.session:
        image_paths = response.session['image_paths']
        for image_path in image_paths:
            path = f'./app/static/app/images/{image_path}'
            if os.path.exists(path):
                os.remove(path)
        del response.session['image_paths']

def index(response):
    if response.method == "POST":
        params = {}
        params['prompt'] = response.POST.get('Prompt', 'A sample image')
        negative_prompt_value = response.POST.get('NegativePrompt')
        if negative_prompt_value is not None:
            params['negative_prompt'] = negative_prompt_value

        steps = response.POST.get('steps')
        if steps is not None:
            params['steps'] = int(steps)

        seed = response.POST.get('seed')
        if seed is not None:
            params['seed'] = int(seed)

        cfg_scale = response.POST.get('cfgScale')
        if cfg_scale is not None:
            params['cfg_scale'] = int(cfg_scale)
        
        samples = response.POST.get('samples')
        if samples is not None:
            params['samples'] = int(samples)
        
        params['width'] = int(response.POST.get('width'))
        params['height'] = int(response.POST.get('height'))

        cleanupImages(response)
        image_paths = generate_image(**params)

        response.session['image_paths'] = image_paths
        return render(response, "app/index.html", {
            'options': options,
            'image_paths': image_paths,
        })

    cleanupImages(response)
    return render(response, "app/index.html", {
        'options': options,
        'image_paths': [],
    })