class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword
            ? {
                  name: {
                      $regex: this.queryString.keyword,
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryString };
    
        // Remove non-filter fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(field => delete queryCopy[field]);
    
        // Advanced filtering with numeric conversion
        Object.keys(queryCopy).forEach(key => {
            if (typeof queryCopy[key] === 'object') {
                Object.keys(queryCopy[key]).forEach(op => {
                    const value = queryCopy[key][op];
                    queryCopy[key][`$${op}`] = isNaN(value) ? value : Number(value); // 👈 convert to Number
                    delete queryCopy[key][op];
                });
            }
        });
    
        console.log("🔍 Final filter:", queryCopy); // DEBUG: check your filter
        this.query = this.query.find(queryCopy);
        return this;
    }

    paginate(resultsPerPage){

        const currentPage = Number(this.queryString.page) || 1;
        const skip = resultsPerPage * (currentPage - 1);
         this.query.limit(resultsPerPage).skip(skip);
        return this;

    }
    
    
}

module.exports = APIFeatures;
