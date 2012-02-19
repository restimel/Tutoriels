
var listeFiltre = [
	{
		nom:"Flou (petit)",
		filtre:[
				[1/10,1/10,1/10],
				[1/10,2/10,1/10],
				[1/10,1/10,1/10]
			]
	},
	{
		nom:"Flou (moyen)",
		filtre:[
				[1/26,1/26,1/26,1/26,1/26],
				[1/26,1/26,1/26,1/26,1/26],
				[1/26,1/26,2/26,1/26,1/26],
				[1/26,1/26,1/26,1/26,1/26],
				[1/26,1/26,1/26,1/26,1/26]
			]
	},
	{
		nom:"Flou (grand)",
		filtre:[
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,2/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
				[1/50,1/50,1/50,1/50,1/50,1/50,1/50]
			]
	},
	{
		nom:"Flou Gaussien (moyen, σ=0.7)",
		filtre:[
			[0.0001,0.002,0.0055,0.002,0.0001],
			[0.002,0.0422,0.1171,0.0422,0.002],
			[0.0055,0.1171,0.3248,0.1171,0.0055],
			[0.002,0.0422,0.1171,0.0422,0.002],
			[0.0001,0.002,0.0055,0.002,0.0001]
		]
	},
/*	{
		nom:"Flou Gaussien (grand)",
		filtre:[
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,2/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50]
		]
	},*/
	{
		nom:"Filtre de Laplace (petit)",
		filtre:[
			[-1,-1,-1],
			[-1,8,-1],
			[-1,-1,-1]
		]
	},
/*	{
		nom:"Filtre de Laplace (moyen)",
		filtre:[
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,2/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26],
		[1/26,1/26,1/26,1/26,1/26]
		]
	},
	{
		nom:"Filtre de Laplace (grand)",
		filtre:[
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,2/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50],
		[1/50,1/50,1/50,1/50,1/50,1/50,1/50]
		]
	},*/
	{
		nom:"Sobel (vertical)",
		filtre:[
				[-1,0,1],
				[-2,0,2],
				[-1,0,1]
			]
	},
	{
		nom:"Sobel (horizontal)",
		filtre:[
			[-1,-2,-1],
			[0,0,0],
			[1,2,1]
		]
	}
];
