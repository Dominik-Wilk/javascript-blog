/* eslint-disable no-inner-declarations */
/* eslint-disable indent */
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
	const optArticleTagsSelector = '.post-tags .list';
	const optAuthorSection = '.post-author';

	const generateTitleLinks = function (customSelector = '') {
		/* remove content from old list of links. */

		const titleList = document.querySelector(optTitleListSelector);
		titleList.innerHTML = '';

		/* find ID for articles and save them to variables */
		const articles = document.querySelectorAll(optArticleSelector + customSelector);

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

	const generateTags = function () {
		/* find all articles */
		const articlesList = document.querySelectorAll('article');
		// console.log(articlesList);
		/* START LOOP: for every article: */
		for (let articleItem of articlesList) {
			/* find tags wrapper */
			let articleWrapper = articleItem.querySelector(optArticleTagsSelector);
			// console.log(articleWrapper);
			/* make html variable with empty string */
			let stringHTML = '';
			/* get tags from data-tags attribute */
			const tagsList = articleItem.getAttribute('data-tags');
			// console.log(tagsList);
			/* split tags into array */
			const tags = tagsList.split(' ');
			// console.log(tags);
			/* START LOOP: for each tag */
			for (const tag of tags) {
				/* generate HTML of the link */
				const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li> `;
				// console.log(linkHTML);
				/* add generated code to html variable */
				stringHTML = stringHTML + linkHTML;
				/* END LOOP: for each tag */
			}
			/* insert HTML of all the links into the tags wrapper */
			articleWrapper.insertAdjacentHTML('beforeend', stringHTML);
			/* END LOOP: for every article: */
		}
	};

	generateTags();

	const tagClickHandler = function (e) {
		/* prevent default action for this event */
		e.preventDefault();

		/* make new constant named "clickedElement" and give it the value of "this" */
		const clickedElement = this;
		console.log(clickedElement);
		/* make a new constant "href" and read the attribute "href" of the clicked element */
		let href = clickedElement.getAttribute('href');

		/* make a new constant "tag" and extract tag from the "href" constant */
		const tag = href.replace('#tag-', '');
		console.log(tag);
		/* find all tag links with class active */
		const activeLinkTags = document.querySelectorAll('a.active[href^="#tag-"]');
		console.log(activeLinkTags);
		/* START LOOP: for each active tag link */
		for (const activeTag of activeLinkTags) {
			/* remove class active */
			activeTag.classList.remove('active');
			/* END LOOP: for each active tag link */
		}
		/* find all tag links with "href" attribute equal to the "href" constant */
		const equalTags = document.querySelectorAll(`a[href="${href}"]`);
		console.log(equalTags);
		/* START LOOP: for each found tag link */
		equalTags.forEach(function (tag) {
			/* add class active */
			tag.classList.add('active');
			/* END LOOP: for each found tag link */
		});
		/* execute function "generateTitleLinks" with article selector as argument */
		generateTitleLinks('[data-tags~="' + tag + '"]');
	};

	const addClickListenersToTags = function () {
		/* find all links to tags */
		const linkTags = document.querySelectorAll('[href^="#tag-"]');
		/* START LOOP: for each link */
		linkTags.forEach(function (link) {
			/* add tagClickHandler as event listener for that link */
			link.addEventListener('click', tagClickHandler);
		});
		/* END LOOP: for each link */
	};

	addClickListenersToTags();

	const generateAuthors = function () {
		const authors = document.querySelectorAll('article');

		for (let authorItem of authors) {
			let authorWrapper = authorItem.querySelector(optAuthorSection);
			let stringHTML = '';

			const author = authorItem.getAttribute('data-author');

			const linkHTML = `by <a href="#author-${author}"><b>${author}</b></a> `;
			stringHTML = stringHTML + linkHTML;

			authorWrapper.insertAdjacentHTML('beforeend', stringHTML);
		}
	};
	generateAuthors();

	const authorClickHandler = function (e) {
		e.preventDefault();

		const clickedElement = this;

		let href = clickedElement.getAttribute('href');

		const writter = href.replace('#author-', '');

		const activeLinkAuthors = document.querySelectorAll('a.active[href^="#author-"]');

		for (const activeAuthor of activeLinkAuthors) {
			activeAuthor.classList.remove('active');
		}

		const equalAuthors = document.querySelectorAll(`a[href="${href}"]`);

		equalAuthors.forEach(function (author) {
			author.classList.add('active');
		});
		generateTitleLinks('[data-author="' + writter + '"]');
	};

	const addClickListenersToAuthors = function () {
		const linkTags = document.querySelectorAll('[href^="#author-"]');
		linkTags.forEach(function (link) {
			link.addEventListener('click', authorClickHandler);
		});
	};

	addClickListenersToAuthors();
}
