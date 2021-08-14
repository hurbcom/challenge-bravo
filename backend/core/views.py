from django.shortcuts import render

from .forms import ConverterForm


def converter(request):
    if request.method == 'POST':
        form = ConverterForm(request.POST)
        if not form.is_valid():
            return render(request, 'index.html', {'form': form})

        return render(request, 'index.html', {'form': form})
    else:
        return render(request, 'index.html', {'form': ConverterForm()})
