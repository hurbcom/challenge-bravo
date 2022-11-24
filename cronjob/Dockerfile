# Referência: https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container
# Referência: https://github.com/Ekito/docker-cron/blob/master/Dockerfile
# Referência: https://gist.github.com/jobwat/e15e2dc740792ef51723096cad38ed3c

FROM ubuntu:20.04

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/crontab

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crontab

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

#Install Cron
RUN apt-get update
RUN apt-get -y install cron

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log