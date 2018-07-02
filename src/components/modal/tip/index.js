var app = getApp();
Component({
	properties:{
		
		tipshowText:{
			type:String,
			value:''
		}
	},
	data:{
		

	},
	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	created(){

	},
	attached(){
		this.animation = wx.createAnimation({
	       	duration: 100,
	      	timingFunction: "linear",
	      	delay: 0
	    }); 
	},

	ready() { 
		var animation = this.animation;
		setTimeout(()=>{
			
		 	animation.opacity(1).step();
		    this.setData({
		        TipAnimation: animation.export()
		    }) 

		},100)

		setTimeout(()=>{
			animation.opacity(0).step();
		    this.setData({
		        TipAnimation: animation.export()
		    })
				this.closeTip()
		},2000)
  	},

  	
	
	moved(){},
	detached(){},


	methods: {
		closeTip(){
		    setTimeout(()=>{
		    	var page = getCurrentPages()[getCurrentPages().length - 1]
                page.setData({tipshowText:''})

		    },100)
		}
		
	}
})