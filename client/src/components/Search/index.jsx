// // import React from 'react'
import "./styles.css"
import Button from '@mui/material/Button';
import { useContext, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { EXCLUDED_WORDS } from "../../utils/excludedWords";


const Search = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [localSearchData, setLocalSearchData] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const [placeholder, setPlaceholder] = useState("products");
  const [animate, setAnimate] = useState(true);

  // const placeholders = [
  //   "shirts",
  //   "shoes",
  //   "electronics",
  //   "books",
  //   "something amazing",
  // ];

 


  // Utility functions first
  const normalizeTerm = (text) => {
    if (!text) return '';
    if (excludedRegex.test(text)) return '';
    return text
      .replace(abbreviationRegex, match => match.replace(/\./g, ''))
      .replace(specialCharsRegex, '')
      .toLowerCase()
      .trim();
  };

  // Constants next
  const excludedRegex = new RegExp(`\\b(${EXCLUDED_WORDS.join("|")})\\b`, "i");
  const specialCharsRegex = /[^\w\s-]/g;
  const abbreviationRegex = /\b([A-Z]\.){1,}[A-Z]?\b/g;

  // Enhanced data preprocessing
  const preprocessedData = localSearchData?.data?.map(item => {
    const terms = [
      item.brand,
      item.name,
      item.categoryName,
      item.subCategoryName
    ].filter(Boolean).map(term => normalizeTerm(String(term)));

    return {
      ...item,
      _normalizedTerms: terms,
      _searchText: terms.join(' ')
    };
  }) || [];

  // Improved suggestion engine
  const getQuickSuggestions = () => {
    if (!context?.isSearch || !preprocessedData.length) return [];

    const searchTerm = normalizeTerm(context.isSearch);
    if (searchTerm.length < 2 || excludedRegex.test(searchTerm)) return [];

    const suggestions = new Map();
    const searchWords = searchTerm.split(/\s+/).filter(Boolean);

    // Phase 1: Find matching products and extract key phrases
    preprocessedData.forEach(item => {
      const matchesSearch = item._normalizedTerms.some(term =>
        term.includes(searchTerm)
      );

      if (matchesSearch) {
        // Extract clean product phrases
        const name = normalizeTerm(item.name);
        const brand = normalizeTerm(item.brand);

        // Generate suggestion variants
        const variants = [
          // Basic category matches
          ...(item.categoryName ? [normalizeTerm(item.categoryName)] : []),
          ...(item.subCategoryName ? [normalizeTerm(item.subCategoryName)] : []),

          // Product name segments
          ...name.split(/\s+/)
            .filter(word => word.length >= 3)
            .map((word, i, words) => {
              // Create 2-3 word phrases around matching terms
              if (word.includes(searchTerm)) {
                const start = Math.max(0, i - 1);
                const end = Math.min(words.length, i + 2);
                return words.slice(start, end).join(' ');
              }
              return null;
            })
            .filter(Boolean),

          // Brand combinations
          ...(brand ? [
            `${searchTerm} ${brand}`,
            `${brand} ${searchTerm}`
          ] : [])
        ];

        // Score and add variants
        variants.forEach(variant => {
          if (!variant || variant.length < 3) return;

          // Calculate score based on:
          // 1. Match position (earlier is better)
          // 2. Term length (shorter is better)
          // 3. Brand presence (higher score)
          const positionScore = variant.startsWith(searchTerm) ? 2 : 1;
          const lengthScore = Math.max(0, 10 - variant.length / 3);
          const brandScore = variant.includes(brand) ? 1.5 : 1;

          const score = positionScore * lengthScore * brandScore * 100;

          const displayText = variant.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          const current = suggestions.get(displayText) || { score: 0 };
          suggestions.set(displayText, {
            text: displayText,
            score: current.score + score
          });
        });
      }
    });

    // Phase 2: Generate intelligent combinations
    if (suggestions.size < 5) {
      const relatedTerms = new Map();

      // Find terms commonly appearing with search term
      preprocessedData.forEach(item => {
        if (item._searchText.includes(searchTerm)) {
          item._normalizedTerms.forEach(term => {
            term.split(/\s+/).forEach(word => {
              if (word !== searchTerm && word.length >= 3) {
                relatedTerms.set(word, (relatedTerms.get(word) || 0) + 1);
              }
            });
          });
        }
      });

      // Create combinations with most frequent terms
      Array.from(relatedTerms.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([term]) => {
          const variants = [
            `${searchTerm} ${term}`,
            `${term} ${searchTerm}`,
            `${term} for ${searchTerm}`
          ];

          variants.forEach(variant => {
            const displayText = variant.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            if (!suggestions.has(displayText)) {
              suggestions.set(displayText, {
                text: displayText,
                score: 80 // Base score for generated combinations
              });
            }
          });
        });
    }

    // Final processing
    return Array.from(suggestions.values())
      .sort((a, b) => b.score - a.score || a.text.length - b.text.length)
      .map(item => item.text)
      .slice(0, 5);
  };

  const quickSuggestions = getQuickSuggestions();




  // Handle input change
  const onChangeInput = (e) => {
    const value = e.target.value;
    context?.setIsSearch(value);
  };

  // Search function
  const search = async (query, type = "typing") => {
    const trimmedQuery = query?.trim();

    // Clear results if query is empty
    if (!trimmedQuery) {
      setLocalSearchData([]);
      if (type === "enter") {
        context?.setSearchData([]);
        context?.setSearchQuery("");
      }
      return;
    }

    try {
      const obj = {
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        query: trimmedQuery,
      };

      // Show loading for at least 500ms to prevent flickering
      const searchStartTime = Date.now();
      const isLoading = type === "enter" ? setSearchLoading : setLoading;
      isLoading(true);

      const res = await postData(`/api/product/search/get`, obj);

      // Calculate remaining time to reach 500ms
      const elapsedTime = Date.now() - searchStartTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (type === "enter") {
        // Only update context on explicit search (Enter/button click)
        context?.setSearchData(res);
        context?.setSearchQuery(trimmedQuery);
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      } else {
        // Store typing results locally
        setLocalSearchData(res);
      }
    } catch (error) {
      console.error("Search request failed:", error);
      // Optionally set error state here
    } finally {
      const isLoading = type === "enter" ? setSearchLoading : setLoading;
      isLoading(false);
    }
  };

  // Debounced search when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (context?.isSearch !== undefined) {
        search(context.isSearch, "typing");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [context?.isSearch]);

  // Handle Enter key press
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !searchLoading) {
      search(context?.isSearch, "enter");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (!searchLoading) {
      search(context?.isSearch, "enter");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Initial load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q");
    if (queryFromUrl) {
      context?.setIsSearch(queryFromUrl);
      search(queryFromUrl, "enter");
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRandomPlaceholder = () => {
    const productData = context?.productData || [];
  
    const suggestions = productData.flatMap(product =>
      [product.brand, product.categoryName, product.thirdSubCategoryName].filter(Boolean)
    );
  
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    return random || "products";
  };
  
  useEffect(() => {
    if (!context?.productData?.length) return;
  
    let index = 0;
    const suggestions = context.productData.flatMap(product =>
      [product.brand, product.categoryName, product.thirdSubCategoryName].filter(Boolean)
    );
  
    if (!suggestions.length) return;
  
    const interval = setInterval(() => {
      setAnimate(false); // reset animation
      setTimeout(() => {
        setPlaceholder(suggestions[index] || "products");
        setAnimate(true); // trigger animation
        index = (index + 1) % suggestions.length;
      }, 50); // small delay for smoother animation restart
    }, 3000);
  
    return () => clearInterval(interval);
  }, [context?.productData]);
  


  return (
    <div className="relative flex items-center justify-center" ref={searchRef}>
      <div className="searchBox w-[100%] h-10 md:h-12 bg-[#e5e5e5] rounded-md relative p-2 flex items-center justify-center">
        <div className="relative w-full">
          {/* Animated Placeholder Layer */}
          {!context?.isSearch && (
            <div className="absolute top-0 left-0 h-[35px] w-full p-2 text-[15px] text-gray-400 pointer-events-none">
              {`Search for `}
              <span className={`lowercase font-medium text-red-300 placeholder-text transition-opacity duration-300 ease-in-out ${animate ? "animate" : ""}`}>
                {`${placeholder}`}
              </span>
            </div>
          )}


          {/* Actual input */}
          <input
            ref={inputRef}
            type="text"
            className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px] text-gray-800"
            value={context?.isSearch || ""}
            onChange={onChangeInput}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onClick={() => setIsFocused(true)}
          />
        </div>

        <Button
          className="!absolute top-[1px] lg:top-[8px] right-[5px] z-50 w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
          onClick={handleSearchClick}
          aria-label="Search"
          disabled={searchLoading}
        >
          {searchLoading ? (
            <CircularProgress size={20} />
          ) : (
            <IoSearch className="text-[#4e4e4e] text-[22px] link" />
          )}
        </Button>
      </div>

      {/* Dropdown with suggestions and results */}
      {isFocused && context?.isSearch && (
        <ul className="suggestionBox absolute top-[55px] left-0 w-full border rounded-md bg-white max-h-[450px] overflow-y-auto shadow-lg z-[1000]">
          {loading ? (
            <li className="p-2 text-center flex justify-center">
              <CircularProgress size={20} />
            </li>
          ) : (
            <>
              {quickSuggestions.length > 0 && (
                <div className="border-b p-2">
                  <p className="text-xs font-semibold text-gray-500 mb-1">QUICK SUGGESTIONS</p>
                  {quickSuggestions.map((suggestion, index) => (
                    <li
                      key={`suggestion-${index}`}
                      className="p-2 flex gap-3 items-center cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        context?.setIsSearch(suggestion);
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        search(suggestion, "enter");
                        setIsFocused(false);
                      }}
                    >
                      <IoSearch className="text-[#4e4e4e] text-[22px] link" />
                      <div>
                        <p className="text-[14px] font-semibold">
                          {suggestion}
                        </p>
                      </div>
                    </li>
                  ))}
                </div>
              )}

              <div className="p-2">
                {localSearchData?.data?.length > 0 ? (
                  localSearchData.data.map((item) => (
                    <li
                      key={item._id}
                      className="p-2 flex gap-3 items-center border-b border-[rgba(0,0,0,0.05)] last:border-b-0 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setIsFocused(false);
                      }}
                    >
                      <img src={item.images[0]} alt={item.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <p className="text-[14px] font-semibold line-clamp-1">
                          {item.name} ({item.brand})
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center">
                    {context?.isSearch.trim() ? "No products found." : "Type to search"}
                  </li>
                )}
              </div>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;

