#!/bin/bash
# Arranca banckend y frontend de una
cd ./backend
source env/bin/activate
python3 manage.py runserver
sleep 2
cd ../frontend
npm run dev