FROM node:14.3

COPY src /opt/app
RUN cd /opt/app/ && npm install
ENTRYPOINT ["node", "/opt/app/app.js"]
CMD ["piano"]
