#pragma once

#include "repository/IStudentRepository.hpp"
#include <memory>
#include <string_view>
#include <vector>

namespace studentrecords {

class StudentService {
public:
    explicit StudentService(std::unique_ptr<IStudentRepository> repository);
    void addStudent(const Student& student);
    [[nodiscard]] Student getStudent(std::string_view id) const;
    [[nodiscard]] std::vector<Student> listStudents() const;
    void updateStudent(const Student& student);
    void deleteStudent(std::string_view id);

private:
    std::unique_ptr<IStudentRepository> repository_;
};

} // namespace studentrecords
