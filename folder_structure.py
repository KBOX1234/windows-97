import os
import json

def get_folder_structure(folder_path):
    folder_structure = {}
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        if os.path.isdir(item_path):
            folder_structure[item] = get_folder_structure(item_path)  # Recursive call for subdirectories
        else:
            folder_structure[item] = None  # Non-directory files
    return folder_structure

def main():
    root_folder = 'C'  # Specify the folder to scan
    folder_structure = get_folder_structure(root_folder)

    # Save to JSON file
    with open('folder_structure.json', 'w') as json_file:
        json.dump(folder_structure, json_file, indent=4)

    print("Folder structure has been saved to 'folder_structure.json'.")

if __name__ == '__main__':
    main()
