#Next.js Teslo shop
Para correr localmente, se necesita la base de datoas

```
docker-compose up -d
```

* El -d, significa __detached__

* MongoDb URL Local:
```
mongodb://localhost:27017
```

## Configurar las variables de entorno
renombrar __.env.template__ a __.env__
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir modulos de node
```
yarn install
yarn dev
```


## LLenar la base de datos con información de pruebas
 llamar:

 ```
 http://localhost:3000/api/seed
 ```
