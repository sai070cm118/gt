var _repository=require('gtrepository');
var winstonConsole=require('gtlogger');

var Service={
    Create:function(Profile,callback){
        console.log(Profile);
        winstonConsole.log('debug',Profile);
        _repository.ProfileRepository.Create(Profile,callback);
    },
    add:function(Profile,callback){
        winstonConsole.log('debug',Profile);
        _repository.ProfileRepository.add(Profile,callback);
    },
    update:function(Profile,callback){
        _repository.ProfileRepository.update(Profile,callback);
    },
    delete:function(id,callback){
        _repository.ProfileRepository.delete(id,callback);
    },
    getAll:function(callback){
        _repository.ProfileRepository.getAll(callback);
    },
    getById:function(id,callback){
        _repository.ProfileRepository.getById(id,callback);
    },
    getByName:function(name,callback){
        _repository.ProfileRepository.getByName(name,callback);
    },
    getByEmail:function(email,callback){
        _repository.ProfileRepository.getByEmail(email,callback);
    },
    searchProfile:function(name,callback){
        /*
        _repository.UserGroupRepository.searchProfile(name,function(result){
            
            console.log(result);

            callback(result);

            
            if(result.error)
                callback(result);
            else{
                _repository.ProfileRepository.searchProfile(result.data,function(result){
                    callback(result);
                });
            }
            
        });
        */

        _repository.ProfileRepository.searchProfile([],function(result){
            callback(result);
        });
    }
};
module.exports=Service;


