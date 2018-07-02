var app = getApp();
Component({
	properties:{
		
		alertshowText:{
			type:String,
			value:''

		},
		outbidAnimation : {
	      type : Object,
	      value  : {
	        duration : 300 
	      }
	    }
		
	},
	data:{
		

	},
	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	created(){

	},
	attached(){
		this.animation = wx.createAnimation({
	       	duration: this.data.outbidAnimation.duration,
	      	timingFunction: "linear",
	      	delay: 0
	    }); 
	},

	ready() { 
		console.log(app,'appapap')
		setTimeout(()=>{
			var animation = this.animation;
		 	animation.translateY(0).step();
		    this.setData({
		        outbidanimationData: animation.export()
		    }) 

		},100)
  	},

  	
	
	moved(){},
	detached(){},


	methods: {
		closeaboutmultbtn(){
			var animation = this.animation;
		 	animation.translateY('100%').step();
		    this.setData({
		        outbidanimationData: animation.export(),
		    }) 
		    setTimeout(()=>{
				this.triggerEvent('cencelAlert')
				var page = getCurrentPages()[getCurrentPages().length - 1]
                page.setData({alertshowText:''})
		    },300)
		}

		
	}
})