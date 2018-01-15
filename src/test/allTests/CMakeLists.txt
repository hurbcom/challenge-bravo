file(GLOB SRCS *.cpp)
include_directories(${CMAKE_SOURCE_DIR})

find_package(Boost REQUIRED COMPONENTS system thread chrono)

add_executable(allTests ${SRCS})

target_link_libraries(allTests
    libgtest
    libgmock
    currencyconv
	${LIBRARIES_SEARCH_PATHS} 
	cpprest 
	cpp_redis 
	tacopie
)