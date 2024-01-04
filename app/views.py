from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(response):
	options = [
		{'label': 'Gandalf', 'value': 'Gandalf', 'image_url': 'Gandalf.jpg'},
		{'label': 'Barbie', 'value': 'Barbie', 'image_url': 'Barbie.jpeg'},
		{'label': 'Dracula', 'value': 'Dracula', 'image_url': 'Dracula.webp'},
		{'label': 'Sauron', 'value': 'Sauron', 'image_url': 'Sauron.jpg'},
		{'label': 'Scooby Doo', 'value': 'Scooby Doo', 'image_url': 'ScoobyDoo.jpeg'},
		{'label': 'Harry Potter', 'value': 'Harry Potter', 'image_url': 'harrypotter.0.jpg'},
		{'label': 'Mickey Mouse', 'value': 'Mickey Mouse', 'image_url': 'Mickey.jpg'},
		
	]

	return render(response, "app/index.html", {'options': options})