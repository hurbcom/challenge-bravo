# Referência: https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container
# Referência: https://github.com/Ekito/docker-cron/blob/master/Dockerfile
# Referência: https://gist.github.com/jobwat/e15e2dc740792ef51723096cad38ed3c
# Referência: https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container/46220104#46220104

FROM ubuntu:20.04

RUN apt-get update && apt-get -y install cron curl dos2unix

# Add crontab file (from your windows host) to the cron directory
ADD crontab /etc/cron.d/crontab

# Change line ending format to LF
RUN dos2unix /etc/cron.d/crontab

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crontab

# Apply cron job
RUN crontab /etc/cron.d/crontab

# Create the log file to be able to run tail
RUN touch /var/log/crontab.log

# Run the command on container startup
CMD cron && tail -f /var/log/crontab.log