#!/usr/bin/env python3
"""
Run the application
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, init_database

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Run the app
    print("Starting Cognitive Skills Test Platform...")
    print("Open your browser and go to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)