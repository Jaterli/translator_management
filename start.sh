#!/bin/bash
# Arranca banckend y frontend de una
# cd ./backend
# source env/bin/activate
# python3 manage.py runserver &
# cd ../frontend &
# npm run dev


#!/bin/bash
cd django-backend && python manage.py runserver &
cd react-frontend && npm run dev
