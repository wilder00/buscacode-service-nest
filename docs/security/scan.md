# Security scan

## Install tools for scan

Read the doc for (trivy)[https://trivy.dev/latest/getting-started/]

```bash
sudo apt-get install wget gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy          # Escanear configuración IaC (Terraform, K8s, etc.)
```

```bash
trivy fs --scanners vuln,secret,misconfig --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL --exit-code 1 --format json --output result.json .
```

```bash
trivy fs --scanners vuln,secret,misconfig --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL .
trivy fs --scanners vuln,secret --severity LOW,MEDIUM,HIGH,CRITICAL .
```

## Semgrep

Read the doc for (semgrep)[https://semgrep.dev/docs/quick-start/]

Este es la fuente : (git semgrep)[https://github.com/semgrep/semgrep?tab=readme-ov-file#option-2-getting-started-from-the-cli]

```bash
docker run --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan /src
```

## OWASP ZAP

Read the doc for (OWASP ZAP)[https://www.zaproxy.org/docs/]

```bash
docker pull zaproxy/zap-stable
```

Accessing from outside container. More about that in (docker run)[https://www.zaproxy.org/docs/docker/about/]

```bash
docker run -p 8090:8090 -i zaproxy/zap-stable zap.sh -daemon -port 8090 -host 0.0.0.0
```

Para levantarlo en modo isolado porque se habilita vulneerabilidad si se accede de forma remota

```bash
docker run --name zapproxy -p 8090:8090 -i zaproxy/zap-stable zap.sh -daemon -config api.addrs.addr.name=".*" -config api.addrs.addr.regex=true -port 8090 -host 0.0.0.0

run --name zapproxy -p 8090:8090 -i zaproxy/zap-stable zap.sh -daemon -config api.key=change-me-9203935709 -config api.addrs.addr.name=".*" -config api.addrs.addr.regex=true -port 8090 -host 0.0.0.0
```

Ejecutar un escaneo

```bash
#docker exec -it zaproxy zap.sh -scan -r http://localhost:3000 -o /home/wilder/Documents/projects/buscacode-service-nest/docs/security/scan.md

curl "http://192.168.0.104:8090/JSON/ascan/action/scan/?url=http://host.docker.internal:3000"
curl "http://192.168.0.104:8090/JSON/ascan/action/scan/?apikey=change-me-9203935709&url=http://192.168.0.104:4321"
curl "http://192.168.0.104:8090/OTHER/core/other/htmlreport/" -o reporte.html
```

## Sonar Qube

Levantar el container de sonar qube en el (doc)[https://docs.sonarsource.com/sonarqube-server/latest/try-out-sonarqube/]

```bash
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
#docker run --name sonarqube-custom -p 9000:9000 sonarqube:community

```

### Ejecutar el escaneo

crear un archivo `sonar-project.properties`

```bash
# Identificación del proyecto
sonar.projectKey=buscacode-service-nest
sonar.projectName=BuscaCode Service Nest
sonar.projectVersion=1.0

# Carpeta donde está el código fuente
sonar.sources=.s

# Opcional: lenguaje, tests, etc.
# sonar.language=ts
# sonar.tests=tests
# sonar.exclusions=node_modules/**

# No pongas sonar.host.url ni sonar.login aquí si ya los pasas por Docker

```

```bash
# optional
sonar.language=ts
sonar.exclusions=node_modules/**
sonar.tests=src/**/*.spec.ts
sonar.test.inclusions=src/**/*.spec.ts
```

Ejecutar el escaneo

```bash
docker run \
   --network="bridge" \
   --rm \
   -e SONAR_HOST_URL="http://192.168.0.104:9000" \
   -e SONAR_TOKEN="<token>" \
   -v "${PWD}:/usr/src:delegated" \
   sonarsource/sonar-scanner-cli:10.0.3.1430_5.0.1
```

### opción 2

```bash
docker run \
  --network="bridge" \
  --rm \
  -e SONAR_HOST_URL="http://192.168.0.104:9000" \
  -e SONAR_TOKEN="<token>" \
  -v "${PWD}:/usr/src:delegated" \
  sonarsource/sonar-scanner-cli:10.0.3.1430_5.0.1 \
  -Dsonar.projectKey=buscacode-service-nest \
  -Dsonar.projectName="BuscaCode Service Nest" \
  -Dsonar.sources=.
```
