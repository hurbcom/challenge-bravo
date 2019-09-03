# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.define "server" do |server|

 	server.vm.box = "ubuntu/bionic64"
 	server.vm.network "forwarded_port", guest: 8000, host: 8001
  	#server.vm.network "public_network"
    server.vm.network "private_network", ip: "192.168.50.2"
  	server.vm.hostname = "server"
  	server.vm.provider "virtualbox" do |vb|
      		vb.memory = "4096"
    	  	vb.name = "server"
  	end
	server.vm.provision :shell, path: "./provision.sh"
end
end