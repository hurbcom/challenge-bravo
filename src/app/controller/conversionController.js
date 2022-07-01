const express = require("express");

exports.getAll = function(req, res) {
  res.send('getAll');
}

exports.getById = function(req, res) {
  res.send('getById');
}

exports.create = function(req, res) {
  res.send('create');
}

exports.update = function(req, res) {
  res.send('update');
}

exports.delete = function(req, res) {
  res.send('delete');
}
