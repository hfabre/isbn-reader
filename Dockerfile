FROM ruby:3.3.5

WORKDIR /app
COPY ./api/ /app

RUN bundle install

EXPOSE 4567

CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]
