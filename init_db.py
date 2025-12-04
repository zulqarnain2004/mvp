#!/usr/bin/env python3
"""
Database initialization script
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, init_database

if __name__ == '__main__':
    print("Initializing database...")
    init_database()
    print("Database initialized successfully!")
    print("\nTo run the application:")
    print("python app.py")
    print("Then open: http://localhost:5000")