var connection = require('./db')

class Pagination {
	constructor(
		query,
		params = [],
		itemsPerPage = 10
	){
		this.query = query;
		this.params = params;
		this.itemsPerPage = itemsPerPage;
		this.currentPage = 1;
	}

	getPage(page) {

		this.currentPage = page - 1; // Pois o banco inicia no registro 0;

		this.params.push(
			this.currentPage * this.itemsPerPage,
			this.itemsPerPage
		);

		return new Promise((resolve, reject) => {
			connection.query(
				[this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results) => {
					if(err) {
						reject(err)
					} else {

						this.data = results[0];
						this.total = results[1][0].FOUND_ROWS;
						this.totalPages = Math.ceil(this.total / this.itemsPerPage);
						this.currentPage++

						resolve(this.data);

					}
				}
			)
		})
	}

	getTotal() {
		return this.total;
	}

	getCurrentPage() {
		return this.currentPage;
	}

	getTotalPages() {
		return this.totalPages;
	}

	getNavigation(params) {
		let limitPagesNav = 5;
		let links = [];
		let pageStart = 0;
		let pageEnd = 0;

		if(this.getTotalPages < limitPagesNav) {
			limitPagesNav = this.getCurrentPage();
		}

		// Saber se estamos nas primeiras páginas
		if((this.getCurrentPage() - parseInt(limitPagesNav / 2 )) < 1) {
			pageStart = 1;
			pageEnd = limitPagesNav;
		}
		// Chegando nas últimas páginas
		else if((this.getCurrentPage() + parseInt(limitPagesNav / 2 )) > this.getTotalPages()) {
			pageStart = this.getTotalPages() - limitPagesNav
			pageEnd = this.getTotalPages();
		} else {
			pageStart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
			pageEnd =  this.getCurrentPage() + parseInt(limitPagesNav / 2);
		}

		if(this.getCurrentPage() > 1) {
			links.push({
				text: '«',
				href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() - 1}))
			})
		}

		for(let x = pageStart; x < pageEnd; x++) {
			links.push({
				text: x,
				href: '?' + this.getQueryString(Object.assign({}, params, {page: x})),
				active: (x === this.getCurrentPage())
			})
		}
		// this.getCurrentPage() < this.getTotalPages()
		if( this.getTotalPages() - this.getCurrentPage() > 1) {
			links.push({
				text: '»',
				href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() + 1}))
			})
		}

		return links
	}

	getQueryString(params) {
		let queryString = [];

		for (let name in params) {
			queryString.push(`${name}=${params[name]}`)
		}
		return queryString.join("&")
	}
}

module.exports = Pagination;
