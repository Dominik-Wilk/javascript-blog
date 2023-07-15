'use strict';

{
	const titleClickHandler = function (event) {
		event.preventDefault();
		const clickedElement = this;

		/* remove class 'active' from all article links  */

		const activeLinks = document.querySelectorAll('.titles a.active');

		for (let activeLink of activeLinks) {
			activeLink.classList.remove('active');
		}

		/* remove class 'active' from all articles */

		const activeArticles = document.querySelectorAll('.active');

		for (let activeArticle of activeArticles) {
			activeArticle.classList.remove('active');
		}

		/* add class 'active' to the clicked link */

		clickedElement.classList.add('active');

		/* get 'href' attribute from the clicked link */

		const atributeClickedLink = clickedElement.getAttribute('href');

		/* find the correct article using the selector (value of 'href' attribute) */

		const targetArticle = document.querySelector(atributeClickedLink);

		/* add class 'active' to the correct article */

		targetArticle.classList.add('active');
	};

	const optArticleSelector = '.post';
	const optTitleSelector = '.post-title';
	const optTitleListSelector = '.titles';

	const generateTitleLinks = function () {
		/* remove content from old list of links. */

		const titleList = document.querySelector(optTitleListSelector);
		titleList.innerHTML = '';

		/* find ID for articles and save them to variables */
		const articles = document.querySelectorAll(optArticleSelector);

		let html = '';

		for (let article of articles) {
			const articleID = article.getAttribute('id');

			/* find element with tile and save it */

			const articleTitle = article.querySelector(optTitleSelector).innerHTML;

			/* create html code for link and save it */

			const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>';

			/* put created html code into html variable */

			html = html + linkHTML;
		}

		/* add html variable into title list */
		titleList.insertAdjacentHTML('beforeend', html);

		const links = document.querySelectorAll('.titles a');
		for (let link of links) {
			link.addEventListener('click', titleClickHandler);
		}

		const firstLink = document.querySelector('.titles a');
		firstLink.classList.add('active');
	};
	generateTitleLinks();
}
