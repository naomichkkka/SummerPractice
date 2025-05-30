document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productList');
    const detailView = document.getElementById('singleProduct');
    const detailContent = document.querySelector('.product-details');
    const searchField = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchBtn');
    const backButton = document.getElementById('backBtn');
    const paginator = document.createElement('div');
    paginator.className = 'pagination';
    document.querySelector('.container').appendChild(paginator);

    let products = [];
    let pageNumber = 1;
    const productsPerPage = 12;

    loadAllProducts();

    searchButton.addEventListener('click', performSearch);
    searchField.addEventListener('keypress', e => e.key === 'Enter' && performSearch());

    backButton.addEventListener('click', () => {
        detailView.style.display = 'none';
        productsContainer.style.display = 'grid';
        showProducts();
    });

    function loadAllProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                products = data.products || [];
                pageNumber = 1;
                showProducts();
            })
            .catch(err => console.error('Error loading products:', err));
    }

    function performSearch() {
        const searchTerm = searchField.value.trim();
        if (!searchTerm) return loadAllProducts();

        fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                products = data.products || [];
                pageNumber = 1;
                showProducts();
            })
            .catch(err => console.error('Search error:', err));
    }

    function showProducts() {
        productsContainer.innerHTML = '';
        
        const startIndex = (pageNumber - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentItems = products.slice(startIndex, endIndex);

        currentItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" />
                <div>
                    <h3>${item.title}</h3>
                    <p>$${item.price}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                productsContainer.style.display = 'none';
                detailView.style.display = 'block';
                loadProductDetail(item.id);
            });
            productsContainer.appendChild(card);
        });

        renderPaginator();
    }

    function renderPaginator() {
        const totalPages = Math.ceil(products.length / productsPerPage);
        paginator.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === pageNumber ? 'page-btn active' : 'page-btn';
            pageBtn.addEventListener('click', () => {
                pageNumber = i;
                showProducts();
            });
            paginator.appendChild(pageBtn);
        }
    }

    function loadProductDetail(id) {
        fetch(`/api/products/${id}`)
            .then(response => response.json())
            .then(renderProductDetail)
            .catch(err => console.error('Error loading product details:', err));
    }

    function renderProductDetail(item) {
        detailContent.innerHTML = `
            <h2>${item.title}</h2>
            <img src="${item.thumbnail}" alt="${item.title}" />
            <p><strong>Brand:</strong> ${item.brand}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Price:</strong> $${item.price}</p>
            <p><strong>Discount:</strong> ${item.discountPercentage}%</p>
            <p><strong>Stock:</strong> ${item.stock}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <div class="product-gallery">
                ${item.images.map(img => `<img src="${img}" alt="${item.title}" />`).join('')}
            </div>
        `;
    }
});