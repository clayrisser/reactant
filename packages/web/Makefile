PLATFORM := $(shell node -e "process.stdout.write(process.platform)")
ifeq ($(PLATFORM), win32)
  SHELL = cmd
endif

.EXPORT_ALL_VARIABLES:

.PHONY: all
all: build

.PHONY: install
install: .make/install
.make/install: package.json
	@sh -c "pnpm --version >/dev/null 2>&1 && \
		pnpm install || (yarn --version >/dev/null 2>&1 && \
		yarn || \
		npm install)"

.PHONY: prepare
prepare:
	@sh prepare.sh
	@mkdir -p .make && touch -m .make/install

.PHONY: build
build: .make/build
.make/build: .make/test-cache $(shell git ls-files)
	-@rm -rf lib || true
	@babel src -d lib --extensions ".ts,.tsx" --source-maps inline
	@tsc -d --emitDeclarationOnly
	@cp -r src/docker lib
	@mkdir -p .make && touch -m .make/build

.PHONY: format
format: install
	@prettier --write ./**/*.{json,md,scss,yaml,yml,js,jsx,ts,tsx} --ignore-path .gitignore
	@mkdir -p .make && touch -m .make/format-cache
.make/format-cache: $(shell git ls-files)
	@$(MAKE) -s format

.PHONY: spellcheck
spellcheck: .make/format-cache
	-@cspell --config .cspellrc src/**/*.ts prisma/schema.prisma.tmpl
	@mkdir -p .make && touch -m .make/spellcheck-cache
.make/spellcheck-cache: $(shell git ls-files)
	@$(MAKE) -s spellcheck

.PHONY: lint
lint: .make/spellcheck-cache
	-@tsc --allowJs --noEmit
	-@eslint --fix --ext .ts,.tsx .
	-@eslint -f json -o node_modules/.tmp/eslintReport.json --ext .ts,.tsx ./
	@mkdir -p .make && touch -m .make/lint-cache
.make/lint-cache: $(shell git ls-files)
	@$(MAKE) -s lint

.PHONY: test
test: .make/lint-cache
	@jest --coverage
	@mkdir -p .make && touch -m .make/test-cache
.make/test-cache: $(shell git ls-files)
	@$(MAKE) -s test

.PHONY: test-watch
test-watch:
	@jest --watch

.PHONY: start
start:
	@babel-node --extensions ".ts,.tsx" src/bin

.PHONY: clean
clean:
	-@jest --clearCache
	@git clean -fXd -e \!node_modules -e \!node_modules/**/* -e \!yarn.lock
	-@rm -rf node_modules/.cache || true
	-@rm -rf node_modules/.tmp || true

.PHONY: purge
purge: clean
	@git clean -fXd
