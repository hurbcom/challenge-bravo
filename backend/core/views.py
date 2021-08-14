from django.shortcuts import render
from django.http.response import HttpResponseRedirect
from django.shortcuts import resolve_url as r

from .forms import ConverterForm, MyCoinModelForm


def converter(request):
    if request.method == 'POST':
        form = ConverterForm(request.POST)
        if not form.is_valid():
            return render(request, 'index.html', {'form': form})

        return render(request, 'index.html', {'form': form})
    else:
        return render(request, 'index.html', {'form': ConverterForm()})


def new(request):
    if request.method == 'POST':
        form = MyCoinModelForm(request.POST)
        if not form.is_valid():
            return render(request, 'new.html', {'form': form})

        form.save()
        return HttpResponseRedirect(r('site:index'))
    else:
        return render(request, 'new.html', {'form': MyCoinModelForm()})
