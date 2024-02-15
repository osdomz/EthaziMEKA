# DESPLIEGUE RETO 4
<img src="https://lh7-us.googleusercontent.com/lj2AIHW7udzUbWNicf1uRvKscZ8uSXFECDoneU2MU9GmoGg9zEdUVSXyX1VeLVfd2TO9zu6GRwggxGkrHXchhHoW2wdC7OZ-NghlHewZeIwcIiQvyf6b_lxABwtumATPVUEa9NB-JUScI9iosEjKHw" width="300">
## INSTALACIÓN BÁSICA

### CONFIGURACIÓN DE LAS IP
- Configuramos la ip de cada máquina en el segundo adaptador de red para que puedan verse entre ellas.  
	==Ansible: 192.168.1.10==
	==MariaDB: 192.168.1.11==
	==Apache + PHP: 192.168.1.12==
	==DNS: 192.168.1.13==
	Y con un ping, cualquier ip de otra de las máquinas se verán entre ellas.

	<img src="https://lh7-us.googleusercontent.com/pPs03Et0Wu7-Tth8HK-WTi_Uny0eLyTB3Ax8BIwoxj7hZEYyJA_eCNqj66M06dG0o2JRo-DuiTkYb_vszFQLAxxMnkTumS6XbX0-02VgJhmInb7joHteygdeqigQEmP3Q0PgyXGeGYKnlXN_XeKa_w" width="300">
	  <img src="https://lh7-us.googleusercontent.com/7CwnzFKjlmLOMy9H8UVj5Gop2ROASU7rtkEo7uO352btJINRoJvftn4KSK2qLXa7TwCe1XsbvNArNxS01JJ8RZSfaJR7vhKO6H08hzaCfcdJyipqW_vqMgc70jwjCN_9Py4QsgayAB1gin8jJdyx9g" width="300">

- ### INSTALACIÓN DE OPENSSH
	```instalar openssh en todas las máquinas.```
	```sudo apt install openssh-server```

- ### CONFIGURACIÓN DE HOSTS Y HOSTNAMES
	configuramos el hosts y el hostname para cada una de las máquinas (apache, mariadb, dns)
    ```nano etc/hosts```
    	  <img src="https://lh7-us.googleusercontent.com/3kholh9_75-sCyYkBMgTExnYW_bR9HPZZ_mDVLTW3Z6ATY2vhUKKHdN6r9iWYUnVAYcXhizul4pdCsgD0yOIAp9VrI99MezD76Hvoam_JCkrMxVJBb3C1OtgRlvRd_Ww-PF03k5krcfYR6HaW6GaJw" width="300">
    ```nano etc/hostname```
    <img src="https://lh7-us.googleusercontent.com/wtuu14XRMj31KYVi_rYdjXsJ9Jqq9LoNHvcrCAQrikP6b3lYOLi2wp82JB-UCz-zgmoI7FspSp3c4CYKsfui2OOAi6FS0joDBKoAMfNnABsDTfdQ7PffNzmqrDBj5VktFNwe8iauReGcw3V0UeIyBA" width="300">
- ### CONEXIÓN POR SSH
    Mediante ssh puedes conectarte a las otras máquinas y configurarlas
    ```ssh (usuario)@192.168.1.(ipdelamaquina)```
    
 - ### CONFIGURACION DE HOSTS
	 Le daremos un nombre de dominio a cada máquina, que más tarde resolverá el dns.
	 
## SERVIDOR ANSIBLE 
- Actualiza el índice de paquetes:
    ```sudo apt update```
    ```sudo apt upgrade```

- Instala Ansible:
	```sudo apt-add-repository ppa:ansible/ansible```
	```sudo apt install ansible```
	```sudo apt install ansible -y```

- Configuración de Ansible:
	crea una carpeta para alojar el despliegue. (RUTA: /home/zornotza)
    ```mkdir despliegue```
    crea el archivo ansible.cfg para configurar ansible  
    ```ansible-config init --disabled > ansible.cfg```

- Configuramos el .conf  
    ![](https://lh7-us.googleusercontent.com/7b9YpmxD4lZfE2-vRplO1rcfm3ovuGZSBjgvaG2N943wH3dt8Xlddf4DHLh0BzyFjNyIBFdJTZ9taIfXpCBq1OYrrqi3c5bVRtmMR67uoKOUxIjf8hUR2iGxur2maiOOkJQlIMYSxhdAbGlZTijLeg)

- Creamos el ssh keygen
	<img src="https://lh7-us.googleusercontent.com/jM2KsivzW5skf050YEqEhPRf9xucK1PZmLAuZIlTyhLIhDfOQAyKSzVgmGPfsS_I9vn0OEjTa40W-mP847UpQjUBNtDqn8xD_llXElrES7Ru5f_pd46hGvVlYhj_yox9ey8lX1HtV9PrDlJR1JvvFA" width="300">
<img src="https://lh7-us.googleusercontent.com/JrndXHiUl6opS5h691k9vHfHRlVYiRPq4jHhAOY8WRESaoZ8FVA2BWLsUc3YvOgAncvipgmcxDesjZSgq-5L3c6vSYAwNBWjEAq8EPpJ0apypJGPF_pyrI9hNZJrN3u0FWF_ItSr25sfUmY3HDnF4A" width="300">
- Creamos la carpeta inventory:
    ```mkdir inventory```
- Añadimos el archivo hosts.ini a la carpeta inventory que le indicará al ansible las máquinas de la red:
    ```sudo nano hosts.ini```
    y configuramos las 3 máquinas
    
![[Pasted image 20240207121810.png]]
- Comprobar conectividad con las maquinas de nuestra red
<img src="https://lh7-us.googleusercontent.com/-rk86u54vhTfO5Asg9U9y2gh4ev4YCPJxFGhDo3xOo2bL9EQ8nxg1ejbKvonGPBGJ1BjiW-H0u37A-_k1PsFKtPciAY9v6s5heypDK86n-XsWE2Dl16TCMCKCdIysuyED_QdHXmvfi95MXz78RhXbg" width="500">
- Configuración de Playbook
```sudo nano instalar_servicios.yml```
![[Pasted image 20240207125458.png]]
```
- name: Install Bind DNS software
  hosts: dns
  become: yes
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes

    - name: Install Bind DNS
      apt:
        name: bind9
        state: present
- name: Install Apache + PHP
  hosts: apache 
  become: yes
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes

    - name: Install Apache and PHP
      apt:
        name:
          - apache2
          - php
          - libapache2-mod-php
        state: present
- name: Install MariaDB
  hosts: mariadb 
  become: yes
  tasks:
    - name: Update package cache
      apt:
        update_cache: yes

    - name: Install MariaDB
      apt:
        name: mariadb-server
        state: present
```

- Una vez configurado enviamos los archivos:
```ansible-playbook -i inventory/hosts.ini instalar_servicios.yml --ask-become-pass```

Y listo, debería estar cada máquina con su servicio instalado.



## SERVIDOR APACHE 
	Paso 1: Actualizar el sistema

Antes de instalar Apache, es una buena práctica asegurarse de que el sistema esté actualizado. Puedes hacerlo ejecutando:

bashCopy code

`sudo apt update sudo apt upgrade`

### Paso 2: Instalar Apache

Una vez que el sistema esté actualizado, puedes instalar Apache usando `apt`:

bashCopy code

`sudo apt install apache2`

### Paso 3: Verificar el estado de Apache

Después de la instalación, puedes verificar si Apache se está ejecutando correctamente usando:

bashCopy code

`sudo systemctl status apache2`

Este comando te mostrará el estado actual del servicio Apache y te permitirá saber si se está ejecutando correctamente.

### Paso 4: Configurar el cortafuegos (firewall)

Si estás utilizando un cortafuegos, necesitarás abrir el puerto 80 (HTTP) para permitir el tráfico web. Puedes hacerlo ejecutando:

bashCopy code

`sudo ufw allow 'Apache'`

### Paso 5: Acceder al servidor web

Una vez que Apache esté instalado y en funcionamiento, puedes acceder a tu servidor web ingresando la dirección IP pública del servidor en un navegador web. Verás la página de inicio predeterminada de Apache.

### Paso 6: Archivos de configuración principales

Los archivos de configuración principales de Apache se encuentran en el directorio `/etc/apache2/`. Los archivos más importantes son:

- `apache2.conf`: El archivo principal de configuración de Apache.
- `sites-available/`: Directorio que contiene los archivos de configuración de los sitios disponibles.
- `sites-enabled/`: Directorio que contiene los enlaces simbólicos a los archivos de configuración de los sitios activados.

### Paso 7: Administración de sitios virtuales

Puedes crear y administrar sitios virtuales (vhosts) para alojar varios sitios web en un solo servidor. Los archivos de configuración de los sitios virtuales se encuentran en el directorio `/etc/apache2/sites-available/`.

### Paso 8: Reiniciar Apache

Si realizas cambios en la configuración de Apache, deberás reiniciar el servicio para que los cambios surtan efecto:

bashCopy code

`sudo systemctl restart apache2`

### Paso 9: Verificación de la instalación

Para verificar que Apache se ha instalado correctamente, abre un navegador web y accede a la dirección IP pública de tu servidor. Deberías ver la página de inicio predeterminada de Apache.
## SERVIDOR DNS
- Crear archivo de zona para las redirecciones:
	Copiamos el archivo por defecto de la zona y creamos el nuestro
	```sudo cp /etc/bind/db.local /etc/bind/zones/nombre_de_dominio.com.zone```
	
- Editamos este archivo:
	```sudo nano /etc/bind/zones/nombre_de_dominio.com.zone```
	ej:```sudo nano /etc/bind/zones/virtualcashgrupo1.com.zone```
![[Pasted image 20240208144336.png]]
	$TTL    604800
	@       IN      SOA     virtualcash.com. root.virtualcash.com. (
							  2         ; Serial
						 604800         ; Refresh
						  86400         ; Retry
						2419200         ; Expire
						 604800 )       ; Negative Cache TTL
	;
	@       IN      NS      virtualcash.com.
	@       IN      A       192.168.1.12
	ansible IN      A       192.168.1.10
	bdd     IN      A       192.168.1.11
	dns     IN      A       192.168.1.13
	www     IN      CNAME   virtualcash.com
	
- Configura el archivo named.conf para que acceda al archivo de zona correcto:
	```sudo nano /etc/bind/named.conf```
- Añadimos el bloque de zona:
	```bash
	zone "nombre_de_dominio.com" {
    type master;
    file "/etc/bind/zones/nombre_de_dominio.com.zone";
	};
	```
![[Pasted image 20240208133306.png]]
- Reseteamos el servicio
![[Pasted image 20240208133459.png]]
	```sudo service bind9 restart```
	
## SERVIDOR MARIADB 
- Importar la base de datos:
	Importamos la base de datos mediante scp, o cualquier otro servicio, en nuestro caso la hemos importado desde google drive.
- una vez importada, iniciaremos mysql
	- PROBLEMA CON EL USUARIO Y CONTRASEÑA
		al intentar acceder a mysql, nos daba error así que lo iniciamos en modo seguro para cambiar la contraseña y el usuario a la de nuestro interés
		
		Detenemos el servicio mysql:
		```sudo systemctl stop mysql```
		
		Iniciamos el servicio en modo seguro haciendo que no se apliquen las reglas de autenticación y podamos acceder sin contraseña:
		```sudo mysqld_safe --skip-grant-tables &```
		
		Entramos con el usuario root:
		```mysql -u root```
		
		Cambiamos la contraseña del usuario:
		```ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';```
		
		Si iniciamos el servidor en modo seguro debemos tener esto en cuenta si más adelante queremos pararlo o reiniciarlo, ya que el reinicio normal del servicio (`systemctl restart mariadb`) no tiene efecto en la configuración, porque el servidor no aplica las reglas de autenticación normales
		
		Detenemos el proceso mysqld_safe:
		```sudo pkill -f mysqld_safe```
		
		Inicia el servidor MariaDB normalmente:
		`sudo systemctl start mariadb`
		
	- SI da problemas iniciar mysql en modo sudo (el usuario por defecto es "root")
		`sudo mysql -u tu_usuario -p`
		
	- Crear la base de datos
		```CREATE DATABASE nombre_bdd```
		
	- Ahora importaremos el .sql a la base de datos de nuestro mariadb
		seleccionamos la base de datos
		```USE nombre_bdd```
		importamos los datos
		`source ruta_del_archivo_sql`
		ej: `source /var/lib/mysql/banca_def.sql`
		
		comprobamos si existen datos en la base de datos 
		(teniendo seleccionada la base de datos "USE nombre_bbdd;", importante poner ";")
		```SHOW TABLES;```
		
		
		
		
		
		
		