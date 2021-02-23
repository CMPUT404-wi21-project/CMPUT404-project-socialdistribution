# subtree branch for backend server
start-server-backend:
	git subtree split --prefix=backend -b backend

# subtree branch for frontend server
start-server-frontend:
	git subtree split --prefix=frontend -b frontend
