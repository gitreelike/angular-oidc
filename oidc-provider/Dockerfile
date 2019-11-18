FROM jboss/keycloak:7.0.1

ENV KEYCLOAK_USER=admin
ENV KEYCLOAK_PASSWORD=admin
ENV KEYCLOAK_IMPORT=/tmp/example-realm.json

RUN /opt/jboss/keycloak/bin/add-user-keycloak.sh -r example -u test -p test

COPY config/example-realm.json /tmp

EXPOSE 8080
EXPOSE 9990
