//module store

//includes
var gh = new GitHub({
    /* also acceptable:
       token: 'MY_OAUTH_TOKEN'
     */
    token: localStorage.getItem('friendy_accss_token')
 });

//class
var StoreAPI = function (config) {
    var jdata = [];
    let repo = gh.getRepo('neocris','friendica');
    var stParseError = function(){
        this.error = new Error("couldn't parse the provided obj");
    }
    var checks = function(s){
        if(!spec(s))
            throw new stParseError();
        else
            return true;
    }
    var spec = function(s){
        stproto = {
            'jot'             : '',
            'post_type'       : 0,
            'profile_uid'     : 415,
            'coord'           : '',
            'post_id'         : '',
            'preview'         : 0,
            'post_id_random'  : 0,
            'category'        : '',
            'emailcc'         : '',
            // end form data
			'template'        : null, //$this->getTemplate(),//
			'type'            : '', //implode("", array_slice(explode("/", $item['verb']), -1)),//
			'suppress_tags'   : false,
			'tags'            : [],
			'hashtags'        : [],//
			'mentions'        : [],//
			'implicit_mentions' : [],//
			'txt_cats'        : 'Categories:',
			'txt_folders'     : 'Filed under:',
			'has_cats'        : '', //((count($categories)) ? 'true' : ''),
			'has_folders'     : '', //((count($folders)) ? 'true' : ''),
			'categories'      : [],
			'folders'         : [],
			'body'            : '',
			'text'            : '', //$text_e,//
			'id'              : random_digits(12), //Math.random()*1000,
			'guid'            : null, //urlencode($item['guid']),//
			'isevent'         : false, //$isevent,
			'attend'          : [], //$attend,
			'linktitle'       : 'View cris profile at http://neocris.github.io', //L10n::t('View %s\'s profile @ %s', $profile_name, $item['author-link']),
			'olinktitle'      : 'View cris profile at http://neocris.github.io',
			'to'              : 'to',
			'via'             : 'via', //
			'wall'            : 'Wall-to-Wall',
			'vwall'           : 'via Wall-To-Wall:',
			'profile_url'     : '',
			'item_photo_menu' : '',
			'name'            : '',
			'thumb'           : '',
			'osparkle'        : '',
			'sparkle'         : '',
			'title'           : '',
			'localtime'       : (new Date()).toLocaleString(),
			'ago'             : (new Date()).toLocaleString() - this.localtime, //$item['app'] ? L10n::t('%s from %s', Temporal::getRelativeDate($item['created']), $item['app']) : Temporal::getRelativeDate($item['created']),
			'app'             : null, //$item['app'],//
			'created'         : null, //Temporal::getRelativeDate($item['created']),//
			'lock'            : false, //'private msg'
			'location'        : '',
			'indent'          : '',
			'shiny'           : '',
			'owner_self'      : '', //$item['author-link'] == Session::get('my_url'),//
			'owner_url'       : '',
			'owner_photo'     : '',
			'owner_name'      : 'cris',
			'plink'           : [], //Item::getPlink($item),
			'edpost'          : [], //$edpost,
			'isstarred'       : 'unstarred', //$isstarred,
			'star'            : [], //$star,
			'ignore'          : false, //$ignore,//
			'tagger'          : [], //$tagger,
			'filer'           : false, //$filer,
			'drop'            : [], //$drop,
			'vote'            : [], //$buttons,
			'like'            : null, //$responses['like']['output'],//
			'dislike'         : null, //$responses['dislike']['output'],//
			'responses'       : [], //$responses,
			'switchcomment'   : 'Comment', //
			'reply_label'     : 'Reply to this', //L10n::t('Reply to %s', $name_e),//
			'comment'         : [], //$comment,
			'previewing'      : '',
			'wait'            : 'Please wait',
			'thread_level'    : 1, //$thread_level,
			'edited'          : false, //$edited,//
			'network'         : null, //$item["network"],//
			'network_name'    : null, //ContactSelector::networkToName($item['network'], $item['author-link']),//
			'received'        : null, //$item['received'],//
			'commented'       : null, //$item['commented'],//
			'created_date'    : null, //$item['created'],//
			'return'          : '', //($a->cmd) ? bin2hex($a->cmd) : '',//
			'delivery'        : [], /*[
				'queue_count'       => $item['delivery_queue_count'],
				'queue_done'        => $item['delivery_queue_done'],
				'notifier_pending'  => L10n::t('Notifier task is pending'),
				'delivery_pending'  => L10n::t('Delivery to remote servers is pending'),
				'delivery_underway' => L10n::t('Delivery to remote servers is underway'),
				'delivery_almost'   => L10n::t('Delivery to remote servers is mostly done'),
				'delivery_done'     => L10n::t('Delivery to remote servers is done'),
			],*/
			'toplevel': false,
			'threaded': false,
			'children': [],
			'flatten': true
		};
        //return _.has(stproto,_.keys(s)); //needs to order s first eventually due to isMatch shortcommings
        //_.isEqual compares by key so it requires arrays are ordered
        return _.difference(_.keys(s),_.keys(stproto)).length == 0 ? true : false;
    }
    var sync = function(j){
        localStorage.friendica = parse(j);
    }
    var parse = function(d){
        return JSON.stringify(d);
    }
    var ret = function(k){
        d = jdata.filter(function(s){
            return (s.id == k)
        }).shift();
        //return _.without(jdata,d);
        return jdata.indexOf(d);
    }
    var load = function(){
        if(localStorage.friendica)
            jdata = jdata.concat(JSON.parse(localStorage.friendica));
    }
    load();
    return {
        get: function(i){
            return i ? [jdata[i]] : jdata;
        },
        //lifo
        post: function(s){
            try {
                checks(s);
                jdata.unshift(s);
                sync(jdata); //very inneficient
            } catch(e) {
                console.log(e);
            }   
        },
        del: function(k){
            jdata.splice(ret(k),1);
            sync(jdata);
            //jdata = rem(k);
        },
        perma: function(t){
            sync(t);
        },
        // use browser sandbox or nodejs app for local use
        export: function(){
            b64 = btoa(localStorage.friendica);
            params = {
                "message": 'post',
                "content": b64,
                "sha": "d.sha"
            };
            /*let gist = gh.getGist("2a5379d420dfae293cb19982eb0c27db"); // not a gist yet
            gist.update({
                description: '',
                files: {
                   "posts.json": {
                      content: ""
                   }
                }
             });*/
             repo.writeFile('master','posts/posts.json',JSON.stringify(jdata),"posts dump", function(){});
            /*$.get(' https://api.github.com/repos/neocris/halcyonic/git/trees/master:posts', function(data){
                data.tree.forEach(function(d){console.log(d.path);
                    if(d.path == "posts.json" && false){console.log('post');
                        sha=d.sha;
                        $.ajax({
                            type: "patch",
                            //url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token=625d8c373e052daad4521d158cdd1a4354231aa3&message=post&content=W3siaWQiOiI2NzVkZWQxNy0xZGJhLWUzZmUtY2I3MC0wOTQxODMyMDkxMWYiLCJ1cmwiOiIiLCJhY2NvdW50Ijp7ImlkIjowLCJkaXNwbGF5X25hbWUiOiJjcmlzIiwiZW1vamlzIjpbXSwiYWNjdCI6ImJvdGRyb2lkIiwiYXZhdGFyIjoiYTI4YWYzMzhjYTgxZWExYy5wbmcifSwiaW5fcmVwbGF5X3RvX2lkIjoiIiwiaW5fcmVwbGF5X3RvX2FjY291bnRfaWQiOiIiLCJyZWJsb2ciOm51bGwsImNvbnRlbnQiOiJoZWxsbyIsImNyZWF0ZWRfYXQiOiIiLCJlbW9qaXMiOltdLCJyZXBsaWVzX2NvdW50IjowLCJyZWJsb2dzX2NvdW50IjowLCJmYXZvdXJpdGVzX2NvdW50IjowLCJyZWJsb2dnZWQiOmZhbHNlLCJmYXZvdXJpdGVkIjpmYWxzZSwibXV0ZWQiOmZhbHNlLCJzZW5zaXRpdmUiOmZhbHNlLCJzcG9pbGVyX3RleHQiOiIiLCJ2aXNpYmlsaXR5IjoicHVibGljIiwibWVkaWFfYXR0YWNobWVudHMiOltdLCJtZW50aW9ucyI6W3siaWQiOjAsImFjY3QiOiJib3Rkcm9pZCJ9XSwidGFncyI6W10sImNhcmQiOnt9LCJwb2xsIjp7Im9wdGlvbnMiOltdfSwiYXBwbGljYXRpb24iOnt9LCJsYW5ndWFnZSI6ImVuIiwicGlubmVkIjpmYWxzZX1d&sha=9e26dfeeb6e641a33dae4961196235bdb965b21b"
                            //url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token=625d8c373e052daad4521d158cdd1a4354231aa3&message=&content=&sha=9e26dfeeb6e641a33dae4961196235bdb965b21b"
                            /*url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token="+localStorage.getItem('accss_token'),
                            data: {
                                "message": "post",
                                "content": b64,
                                "sha": d.sha
                            }*/
                            /*url: "https://api.github.com/gists/2a5379d420dfae293cb19982eb0c27db",
                            data: {
                                "description": "",
                                "files": {
                                    "posts.json": {
                                        "content": ""
                                    }
                                }
                            }*/
                            /*url: "https://api.github.com/gists/2a5379d420dfae293cb19982eb0c27db?access_token="+localStorage.getItem('accss_token'),
                            data: {
                                "description": "",
                                "files": {
                                    "posts.json": {
                                        "content": ""
                                    }
                                }
                            }*\/
                        });
                    }
                });
            });*/
        },
        import: function(){
            repo.getContents('master','posts/posts.json',false,function(){}).then(function(j){
                jdata = JSON.parse(atob(j.data.content));
                jdata.forEach(function(jd){
                    $(timeline_template(jd)).prependTo('#conversation-end');
                });
                sync(jdata);
            });
        }
    }
}