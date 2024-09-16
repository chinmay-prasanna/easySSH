import eel
import subprocess
import os
from models import *
from sqlalchemy.orm import sessionmaker
import paramiko

eel.init('./web')

env = os.environ.copy()

if "GTK_PATH" in env.keys():
    env.pop("GTK_PATH")

engine = create_engine('postgresql://postgres:admin@localhost:5432/batadase')
Session = sessionmaker(bind = engine)
session = Session()

@eel.expose
def open_terminal(key_id):
    key = session.query(Key).get(key_id)
    service = session.query(Service).get(key.service_id)
    username = key.username
    hostname = service.ip_address
    port = service.port
    command = f"ssh -p {port} {username}@{hostname}"
    subprocess.Popen(['gnome-terminal', '--', 'bash', '-c', f'{command}; exec bash'], shell=False, env=env)

@eel.expose
def get_services():
    services = session.query(Service).all()
    return_list = []
    for service in services:
        return_list.append({
            "id":service.id,
            "ip_address":service.ip_address,
            "name":service.name,
            "port":service.port
        })
    return return_list

@eel.expose
def get_keys(service_id:None):
    if service_id:
        keys = session.query(Key).filter_by(service_id=service_id).all()
    else:
        keys = session.query(Key).all()
    return_list = []
    for key in keys:
        service = session.query(Service).get(key.service_id)
        return_list.append({
            "id":key.id,
            "service_id":key.service_id,
            "service_ip":service.ip_address,
            "username":key.username,
            "ssh_key_path":key.ssh_key_path,
            "port":service.port
        })
    return return_list


@eel.expose
def add_service(service_object):
    service = Service(
        name=service_object['service_name'],
        ip_address=service_object['service_ip'],
        port=service_object['service_port']
    )
    session.add(service)
    session.commit()
    print("service added")

@eel.expose
def add_key(key_data_object):
    username = key_data_object['username']
    directory = key_data_object['ssh_key_path']


    service = session.query(Service).get(key_data_object['service'])

    key = Key(
        service_id=service.id,
        username=username,
        ssh_key_path=directory
    )
    session.add(key)
    session.commit()

@eel.expose
def delete_service(service_id):
    session.query(Key).filter_by(service_id=service_id).delete()
    service = session.query(Service).get(service_id)
    session.delete(service)
    session.commit()

@eel.expose
def delete_key(key_id):
    key = session.query(Key).get(key_id)
    session.delete(key)
    session.commit()

eel.start('index.html', port=8080)
