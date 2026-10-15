#pragma once

#include "repository/IStudentRepository.hpp"
#include <string>
#include <unordered_map>

namespace studentrecords {

class InMemoryStudentRepository final : public IStudentRepository {
public:
    void addStudent(const Student& student) override;
    [[nodiscard]] std::optional<Student> getStudentById(std::string_view id) const override;
    [[nodiscard]] std::vector<Student> getAllStudents() const override;
    void updateStudent(const Student& student) override;
    void deleteStudent(std::string_view id) override;

private:
    std::unordered_map<std::string, Student> students_;
    std::unordered_map<std::string, std::string> emailToStudentId_;
};

} // namespace studentrecords
