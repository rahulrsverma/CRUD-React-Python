import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Path to the JSON file
DATA_FILE = 'items.json'

# Ensure JSON file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as file:
        json.dump([], file)

# Helper function to read the data from the JSON file
def read_data():
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

# Helper function to write the data to the JSON file
def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# Route to get all items (Read)
@app.route('/items', methods=['GET'])
def get_items():
    items = read_data()
    return jsonify(items)

# Route to add a new item (Create)
@app.route('/item', methods=['POST'])
def add_item():
    data = request.get_json()
    items = read_data()
    
    # Generate an ID for the new item
    new_id = max([item["id"] for item in items], default=0) + 1
    new_item = {
        "id": new_id,
        "name": data["name"],
        "description": data["description"]
    }
    
    items.append(new_item)
    write_data(items)
    return jsonify({'message': 'Item added successfully!'})

# Route to update an existing item (Update)
@app.route('/item/<int:id>', methods=['PUT'])
def update_item(id):
    data = request.get_json()
    items = read_data()
    
    for item in items:
        if item['id'] == id:
            item['name'] = data.get('name', item['name'])
            item['description'] = data.get('description', item['description'])
            write_data(items)
            return jsonify({'message': 'Item updated successfully!'})
    
    return jsonify({'message': 'Item not found'}), 404

# Route to delete an item (Delete)
@app.route('/item/<int:id>', methods=['DELETE'])
def delete_item(id):
    items = read_data()
    items = [item for item in items if item['id'] != id]
    write_data(items)
    return jsonify({'message': 'Item deleted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
