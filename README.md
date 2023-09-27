# piiquante

AVANT DE COMMENCER

Piiquante est une application qui se propose de réunir une communauté autour des sauces piquantes. Faites-vous un compte, proposez des sauces pour les archiver, téléchargez une photo d'identification, puis notez-les !

Optimisé pour les bases de données NoSql MongoDB.


********  Installation Backend  *********

-> Pour installer le back, lancer "npm install" de la racine du repo.


-> Configurer les variables environnements
    
    --> Créer une fichier .env contenant les variables :
        ---> PORT: pour le port 
        ---> DBURL: pour l'adresse entière de la base de donnée: Ex: "mongodb+srv://<username>:<password>@<clusterName>.mongodb.net/?retryWrites=true&w=majority"
        --->TOKEN_SECRET: pour la clef qui générera le hash du password

    

********  Démarrer l'application  *********

-> Pour démarrer l'application, lancer "npm start" à la racine du projet.