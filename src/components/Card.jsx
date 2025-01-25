import React, { useState, useEffect } from "react";
import "../assets/styles/Card.css";

function Card() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/nike");
                if (!response.ok) throw new Error("Failed to fetch proxy data");
                const data = await response.json();
                console.log("API Response:", data);
                const filteredProducts = data.objects.filter((product) => product.productInfo?.some((info) => info.launchView && info.merchProduct?.productType === "FOOTWEAR"));
                setProducts(filteredProducts);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProducts();
    }, []);

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
        <div className="all-products">
            {products.map((sneaker) => {
                return sneaker.productInfo.map((info, index) => {
                    const title = info.productContent?.title || "";
                    const color = sneaker.publishedContent?.properties?.coverCard?.properties?.title || "";
                    const exclusiveAccess = info.merchProduct?.exclusiveAccess ? "Yes" : "No";
                    const launchType = launchConverter[info.launchView?.method] || "";
                    const image = sneaker.publishedContent?.nodes?.[0]?.nodes?.[0]?.properties?.squarish?.url || "";
                    const date = info.launchView?.startEntryDate || "";
                    const parsedDate = date ? new Date(date) : null;
                    const launchDate = parsedDate ? parsedDate.toLocaleDateString() : "";
                    const launchTime = parsedDate ? parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
                    const price = info.merchPrice?.fullPrice || "";

                    const slug = sneaker.publishedContent?.properties?.seo?.slug || "";
                    const productUrl = `https://www.nike.com/${sneaker.marketplace?.toLowerCase()}/launch/t/${slug}`;

                    let stockInfo = "";
                    if (info.skus && info.availableGtins) {
                        stockInfo = info.skus
                            .map((skuDetail) => {
                                const availableGtin = info.availableGtins.find((g) => g.gtin === skuDetail.gtin);
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
                        <div className="product" key={`${sneaker.id}-${index}`}>
                            <a href={productUrl} target="_blank">
                                <h2>{title}</h2>
                                <h2>{color}</h2>
                                <img src={image} alt={title} />
                                <p><strong>Exclusive Access:</strong> {exclusiveAccess}</p>
                                <p><strong>Launch Type:</strong> {launchType}</p>
                                <p><strong>Launch Date:</strong> {launchDate}</p>
                                <p><strong>Launch Time:</strong> {launchTime}</p>
                                <p><strong>Price:</strong> €{price}</p>
                                <div className="stock-info" dangerouslySetInnerHTML={{ __html: stockInfo }} />
                            </a>
                        </div>
                    );
                });
            })}
        </div>
    );
}

export default Card;
