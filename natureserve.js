let data = {
	"criteriaType": "species",
	"textCriteria": [],
	"statusCriteria": [],
	"pagingOptions": {
		"page": null,
		"recordsPerPage": 2000
	},
	"recordSubtypeCriteria": [],
	"modifiedSince": null,
	"locationOptions": null,
	"classificationOptions": null,
	"speciesTaxonomyCriteria": [
		{
			"paramType": "scientificTaxonomy",
			"level": "class",
			"scientificTaxonomy": "aves",
			"kingdom": "animalia"
		}
	],
	locationCriteria: [{
		"paramType": "subnation",
		"subnation": input.state,
		"nation": "US"
	}]
}

const url = 'https://explorer.natureserve.org/api/data/speciesSearch'