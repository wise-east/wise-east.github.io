all: 
	# brew switch openssl 1.0.2s
	bundle exec jekyll build
	bundle exec jekyll serve

setup: 
	bundle install