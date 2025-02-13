#!/bin/bash
# Arranca banckend y frontend de una
# cd ./backend
# source env/bin/activate
# python3 manage.py runserver &
# cd ../frontend &
# npm run dev


#!/bin/bash
cd backend && python3 manage.py runserver &
cd frontend && npm run dev
