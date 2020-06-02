
IMAGE_PREFIX=res/

all: validate

.PHONY: validate
validate: build
	$(MAKE) killall
	git remote -v | tee check.log
	docker run \
		--name res_validation \
		--valume /var/run/docker.sock:/var/run/docker.sock \
		$(IMAGE_PREFIX)validate-music \
		| tee -a check.log
	
.PHONY: killall
killall:
	docker kill $$(docker ps -a -q)
	docker rm $$(docker ps -a -q)

.PHONY: build
build: build-musician build-auditor build-validate-music


.PHONY: build-%
build-%: docker/image-%/Dockerfile
	docker build \
		--tag $(IMAGE_PREFIX)$* \
		--file ./docker/image-$*/Dockerfile \
		./docker/image-$*/

.PHONY: npm-sh
npm-sh:
	docker run -it --rm --volume "$(shell pwd):/mnt" --workdir /mnt node:14.3-slim /bin/bash
