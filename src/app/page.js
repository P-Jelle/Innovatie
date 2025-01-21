export default async function Page() {
    const getSneakers = async () => {
        const res = await fetch("https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace%28NL%29&filter=language%28nl%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc")
        return res.json();   
    }

    const data = await getSneakers();
    const sneakers = data.objects;

    const stockIndicator = {
        OOS: "❌",
        LOW: "🟠",
        MEDIUM: "🟡",
        HIGH: "🟢",
    };

    const launchConverter = {
        DAN: "Raffle",
        LEO: "Queue",
        FLOW: "Drop",
    };

    return (
        <ul className="product-list">
            {sneakers.map((sneaker) => {
                const title = sneaker.productInfo[0].productContent?.title || "";
                const color = sneaker.publishedContent?.properties?.coverCard?.properties?.title || "";
                const exclusiveAccess = sneaker.productInfo[0].merchProduct?.exclusiveAccess ? "Yes" : "No";
                const launchType = launchConverter[sneaker.productInfo[0].launchView?.method] || "";
                const image = sneaker.publishedContent?.nodes?.[0]?.nodes?.[0]?.properties?.squarish?.url || "";
                const date = sneaker.productInfo[0].launchView?.startEntryDate || "";
                const parsedDate = date ? new Date(date) : null;
                const launchDate = parsedDate ? parsedDate.toLocaleDateString() : "";
                const launchTime = parsedDate ? parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
                const price = sneaker.productInfo[0].merchPrice?.fullPrice || "";

                const slug = sneaker.publishedContent?.properties?.seo?.slug || "";
                const productUrl = `https://www.nike.com/${sneaker.marketplace?.toLowerCase()}/launch/t/${slug}`;

                let stockInfo = "";
                if (sneaker.productInfo[0].skus && sneaker.productInfo[0].availableGtins) {
                    stockInfo = sneaker.productInfo[0].skus
                        .map((skuDetail) => {
                            const availableGtin = sneaker.productInfo[0].availableGtins.find(g => g.gtin === skuDetail.gtin);
                            const stockLevel = availableGtin?.level || "";
                            const size = skuDetail.countrySpecifications?.[0]?.localizedSize || "";
                            const stockEmoji = stockIndicator[stockLevel.toUpperCase()] || "";
                            return `
                                <div class="stock-item">
                                    <span class="stock-emoji">${stockEmoji}</span>
                                    ${size} - ${stockLevel}
                                </div>
                            `;
                        })
                        .join("");
                }

                return (
                    <li className="product" key={sneaker.id}>
                        <a href={productUrl} target="_blank">
                            <h2>{title}</h2>
                            <h2>{color}</h2>
                            <p><strong>Exclusive Access:</strong> {exclusiveAccess}</p>
                            <p><strong>Launch Type: </strong>{launchType}</p>
                            <p><strong>Launch Date: </strong>{launchDate}</p>
                            <p><strong>Launch Time: </strong>{launchTime}</p>
                            <p><strong>Price: €</strong>{price}</p>
                            <img src={image} alt={title}/>
                            <div dangerouslySetInnerHTML={{ __html: stockInfo }} />
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
